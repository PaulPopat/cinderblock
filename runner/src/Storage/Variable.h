#include <vector>
#include <emscripten/val.h>

using namespace emscripten;

namespace Storage
{
  class Variable
  {
  public:
    static Variable *Parse(val value);
    static void Register(char identifier, Variable *init(char *binary, int offset));
    virtual const val raw() const = 0;
  };
}