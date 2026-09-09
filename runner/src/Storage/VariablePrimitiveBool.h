#include "./Variable.h"
#include "./Frame.h"

namespace Storage
{
  class VariablePrimitiveBool : Variable
  {
  public:
    const static char TypeName = 2;
    VariablePrimitiveBool(bool value);
    VariablePrimitiveBool(val value);

    const val raw() const;

  private:
    bool value;
  };
}