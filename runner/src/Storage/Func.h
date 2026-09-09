#include "./Variable.h"
#include "../Binary/CreateFunc.h"

namespace Storage
{
  class Func
  {
  public:
    Func(Binary::CreateFunc *model);

  private:
    Binary::CreateFunc *model;
  };
}